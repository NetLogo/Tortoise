(ns agents.comps
  (:require [agents.singletons.id-manager :as id-manager]
            [agents.singletons.self-manager :as self-manager]
            [clojure.core.reducers :as r])
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
        :ask (fn [f] (do ((self-manager/ask-agent f) e)
                         (if (= (:id (self-manager/self)) -1)
                           ;; TODO: bad exception.
                           (throw new js/Error "Death or something."))
                         nil))
        ;; @world.selfManager.askAgent(thing-to-do)(me) -- JS equiv. JTT (8/27/14)
        :projection-by (fn [f] ((self-manager/ask-agent f) e)))

(compnt watch []
        ;; TODO: cl-dependent -- JTT (8/27/14)
        :watchme (fn [] (.watch (.. js/workspace -world -observer) e)))

(compnt-let patch-topology []

            [px :pxcor
             py :pycor
             topo #(.. js/workspace -world -topology)]

            ;; TODO: basically cl-dependent -- JTT (8/2814)
            :distance (fn [agent] ((.-distance topo) px py agent))
            :distance-xy (fn [x y] ((.-distanceXY topo) px py x y))

            :towards-xy (fn [x y] ((.-towards topo) px py x y))

            :get-neighbors (fn [] ((.-getNeighbors topo) px py))
            :get-neighbors-4 (fn [] ((.-getNeighbors4 topo) px py))

            :in-radius (fn [agents radius] ((.-inRadius topo) px py agents radius))

            ;; in Tortoise proper patchAt is contained in a try/catch? -- JTT (8/27/14)
            :patch-at (fn [dx dy] ((aget topo "get-patch") (+ px dx) (+ py dy))))

(compnt-let self-vars [defaults]

            [_self_vars #(atom defaults)]

            :_self_vars _self_vars
            :get-var  (fn [var-name] ((keyword var-name) @_self_vars))
            :set-var! (fn [var-name val] (swap! _self_vars assoc (keyword var-name) val)))

(compnt-let turtle-set []

            [_turtle_set #(atom #{})]

            :_turtle_set _turtle_set
            :turtles (fn [] @_turtle_set))

(compnt-let turtle-getters []

            [turtles :turtles]

            :turtles-here (fn [] (turtles))
            ;; TODO: cl-dependent (.getBreedName) -- JTT (8/28/14)
            :breed-here (fn [breed-name] (r/filter #(= (.getBreedName %) breed-name) (turtles))))

(compnt-let turtles-at []

            [patch-at :patch-at]

            :turtles-at (fn [x y] (((patch-at x y) :turtles-here))))

(compnt-let turtle-tracking []

            [_turtle_set :_turtle_set]

            :track-turtle   (fn [turtle] (swap! _turtle_set conj turtle))
            :untrack-turtle (fn [turtle] (swap! _turtle_set disj turtle)))

(compnt-let compare-by-id []

            [id :id]

            :compare (fn [agent] (= id (.-id agent))))

(compnt-let patch-to-string []

            [pxcor :pxcor
             pycor :pycor]

            :to-string (fn [] (str "(patch " pxcor " " pycor ")")))

(compnt-let cl-patch-update []

            [cl-update-fn #((.. js/workspace -updater -updated) (clj->js e))]

            :gen-update (fn [var-name] (cl-update-fn var-name)))
