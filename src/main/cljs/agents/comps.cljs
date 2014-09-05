(ns agents.comps
  (:require [agents.singletons.id-manager :as id-manager]
            [agents.singletons.self-manager :as self-manager]
            [clojure.core.reducers :as r]
            [util.colormodel :as cm]
            [engine.core.turtleset]) ;; TODO: cl-dependent -- JTT 9/3/14
  (:require-macros [lib.component :refer [compnt compnt-let]]))

(compnt patch-coordinates [x y]
        :pxcor x
        :pycor y
        :get-coords #(array x y))

(compnt indexed [name]
        :id (id-manager/new-id! name))

(compnt-let patch-reset []

            [x :pxcor
             y :pycor]

            :reset #(agents.patch.patch x y))

(compnt ask []
        ;; may need to use this-as instead of referring to e -- JTT (8/27/14)
        :ask (fn [f] (this-as me
                              (do ((self-manager/ask-agent f) me)
                                (if (= (:id (self-manager/self)) -1)
                                  ;; TODO: bad exception.
                                  (throw new js/Error "Death or something.")))))
        ;; @world.selfManager.askAgent(thing-to-do)(me) -- JS equiv. JTT (8/27/14)
        :projection-by (fn [f] (this-as me
                                        ((self-manager/ask-agent f) me))))

(compnt watch []
        ;; TODO: cl-dependent -- JTT (8/27/14)
        ;; REFER: observer-hackpatch-cl.js in cl-shiv -- JTT (9/5/14)
        :watchme (fn [] (this-as me (.watch (.. js/world -observer) me))))

(compnt-let patch-topology []

            [px :pxcor
             py :pycor]
            ;; cannot 'let' world (and hence topology) because they are
            ;; too co-dependent - it will not be defined before patch
            ;; asks for it -- JTT 9/2/14

            ;; TODO: basically cl-dependent -- JTT (8/28/14)
            :distance (fn [agent] (.distance (.-topology js/world) px py agent))
            :distance-xy (fn [x y] (.distanceXY (.-topology js/world) px py x y))

            :towards-xy (fn [x y] (.towards (.-topology js/world) px py x y))

            ;; getNeighbors should reference world so it returns a patchset
            :get-neighbors (fn [] (.getNeighbors js/world px py))
            :get-neighbors-4 (fn [] (.getNeighbors4 js/world px py))

            :in-radius (fn [agents radius] (.inRadius (.-topology js/world) px py agents radius))

            ;; in Tortoise proper patchAt is contained in a try/catch? -- JTT (8/27/14)
            :patch-at (fn [dx dy] ((aget (.. js/world -topology) "get-patch") (+ px dx) (+ py dy))))

(compnt-let turtle-set []

            [_turtle_set #(atom [])]

            :_turtle_set _turtle_set
            ;; into-array forces it to be a JS arr -- JTT 9/3/14
            :turtles (fn [] (into-array @_turtle_set)))

(compnt-let turtle-getters []

            [_turtle_set :_turtle_set
             turtles     :turtles]

            :turtles-here (fn [] (new engine.core.turtleset (turtles)))
            ;; TODO: cl-dependent (.getBreedName) -- JTT (8/28/14)
            ;; Must force the reduced values into a JS arr, same reasons as with (turtles) -- JTT 9/4/13
            ;;:breed-here (fn [breed-name] (into-array (r/filter #(= (.getBreedName %) breed-name) (into [] @_turtle_set))))
            :breed-here (fn [breed-name] (.filter (turtles) #(= (.getBreedName %) breed-name))))

(compnt-let turtles-at []

            [patch-at :patch-at]

            ;; TODO: js-call when could be cljs -- JTT 9/5/14
            :turtles-at (fn [x y] (.turtlesHere (patch-at x y))))

(compnt-let turtle-tracking []

            [_turtle_set :_turtle_set]

            :track-turtle   (fn [turtle] (swap! _turtle_set conj turtle))
            :untrack-turtle (fn [turtle] (reset! _turtle_set (vec (r/filter #(not= % turtle) @_turtle_set)))))

(compnt-let sprout-turtles []

            [track-turtle :track-turtle
             px :pxcor
             py :pycor]

            ;; TODO: cl-dependent
            :sprout! (fn [n breed]
                       ;; Must provide correct context, otherwise this ends up calling things on Window.
                       ;; -- JTT 9/4/13
                       (.call (.. js/world -turtleManager -createTurtles) (.-turtleManager js/world) n breed px py)))

(compnt-let compare-by-id []

            [id :id]

            :compare (fn [agent] (= id (.-id agent))))

(compnt-let patch-to-string []

            [pxcor :pxcor
             pycor :pycor]

            :to-string (fn [] (str "(patch " pxcor " " pycor ")")))

(compnt-let self-vars [defaults]

            [_self_vars #(atom defaults)]

            :_self_vars _self_vars
            :get-var  (fn [var-name] ((keyword var-name) @_self_vars))
            :set-var! (fn [var-name val] (do
                                           (swap! _self_vars assoc (keyword var-name) val)
                                           ;; must lookup :get-update at fn runtime in order
                                           ;; to add the self-vars component _before_ adding
                                           ;; the cl-update component, which in turn allows
                                           ;; cl-update to avoid using `this`, the usage of which results
                                           ;; in broken-scope references to Window and
                                           ;; other nonsense. -- JTT 9/3/14
                                           ;; TODO: cl-interop nonsense - `this` refers to the JS
                                           ;; converted version of `e`, so it has to be used as a
                                           ;; js object even though it's the cljs entity...
                                           ;; -- JTT 9/3/14
                                           (this-as t ((aget t "gen-update") var-name)))))

(compnt-let nuanced-set-var-and-update []
            ;; Provides UI optimizations for tracking patch label count and declaring patches non-black.
            ;; Basically a mapping from variable names to nuanced computations (like wrapping a color or
            ;; checking that a label is non-empty) -- it's a special side-effects machine.
            ;; -- JTT 9/3/14

            [get-var :get-var
             ipc     :_incrementPatchLabelCount
             dpc     :_decrementPatchLabelCount
             declare-non-black :_declareNonBlackPatch]

            :_self-var-update-fn (fn [var-name val send-update set-val]
                                   (let [is?    (partial = var-name)
                                         !nil? #(not (nil? %))]
                                     (cond
                                      (is? "plabel") (let [plabel (get-var "plabel")]
                                                       (do
                                                         (set-val val)
                                                         (send-update)
                                                         (when (and (!nil? dpc) (not= plabel "") (= val "")) (dpc))
                                                         (when (and (!nil? ipc) (= plabel "") (not= val "")) (ipc))))
                                      ;; TODO: cl-dependent color wrapping
                                      (is? "pcolor") (let [pcolor (get-var "pcolor")
                                                           new-color (cm/wrapColor val)]
                                                       (when (not= new-color pcolor)
                                                         (set-val new-color)
                                                         (send-update)
                                                         (and (not= new-color 0) (declare-non-black))))
                                      (is? "plabel-color") (do (set-val (cm/wrapColor val))
                                                               (send-update))
                                      ;; refuse to allow updating of px/pycor. This is not the best fix,
                                      ;; but it works well enough for now -- this way patch.pxcor can
                                      ;; never be out of sync with patch.getVariable('pxcor') unless
                                      ;; one of the variables is unsafely set using JS. -- JTT 9/3/14
                                      (is? "pycor") (throw (js/Error. "Cannot change pycor of a patch. Create new patch instead."))
                                      (is? "pxcor") (throw (js/Error. "Cannot change pxcor of a patch. Create new patch instead."))
                                      :default (set-val val))))) ;; only UI-related vars need to call updater. -- JTT 9/4/13

(compnt-let *nuanced-set-var! []
            ;; Must be added after (self-vars) and (nuanced-set-var-and-update).
            ;; Overwrites :set-var! to check the mappings in nuanced-set-var... and perform
            ;; computations for wrapping color values and performing UI optimization function calls.
            ;; Feels sorta gross, but hopefully it works. -- JTT 9/3/14

            [_self_vars :_self_vars
             var-update :_self-var-update-fn]

            :set-var! (fn [var-name val] (this-as t
                                                  (let [gen-update (aget t "gen-update")]
                                                    (var-update var-name
                                                                val
                                                                #(gen-update var-name)
                                                                (partial swap! _self_vars assoc (keyword var-name)))))))

(compnt cl-update []

            ;; this conversion shouldn't be too expensive because it only occurs
            ;; at initialization time -- JTT 9/3/14

            :gen-update (fn [var-name] (((.. js/workspace -updater -updated) (clj->js e)) var-name)))
