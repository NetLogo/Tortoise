(ns agents.comps
  (:require [agents.singletons.id-manager :as id-manager]
            [agents.singletons.self-manager :as self-manager]
            [clojure.core.reducers :as r])
  (:require-macros [lib.component :refer [compnt compnt-let]]))

(compnt patch-coordinates [x y]
        :pxcor x
        :pycor y
        :getCoords #(array x y))

(compnt indexed [name]
        :id (id-manager/new-id! name))

(compnt-let patch-reset []

            [x :pxcor
             y :pycor]

            :reset #(agents.patch.patch x y))

(compnt ask []
        ;; may need to use this-as instead of referring to e -- JTT (8/27/14)
        :ask (fn [f] ((self-manager/ask-agent f) e)))
        ;; @world.selfManager.askAgent(thing-to-do)(me) -- JS equiv. JTT (8/27/14)

(compnt watch []
        ;; TODO: cl-dependent -- JTT (8/27/14)
        :watchme (fn [] (.watch (.. js/workspace -world -observer) e)))

(compnt-let patch-topology []

            [px :pxcor
             py :pycor]

            ;; TODO: basically cl-dependent
            :distance (fn [agent] ((.. js/workspace -world -topology -distance) px py agent))
            :distance-xy (fn [x y] ((.. js/workspace -world -topology -distanceXY) px py x y))

            :towards-xy (fn [x y] ((.. js/workspace -world -topology -towards) px py x y))

            :get-neighbors (fn [] ((.. js/workspace -world -topology -getNeighbors) px py))
            :get-neighbors-4 (fn [] ((.. js/workspace -world -topology -getNeighbors4) px py))

            ;; in Tortoise proper patchAt is contained in a try/catch? -- JTT (8/27/14)
            :patch-at (fn [dx dy] ((aget (.. js/workspace -world -topology) "get-patch") (+ px dx) (+ py dy))))

(compnt-let self-vars [defaults]

            [_self_vars #(atom defaults)]

            :_self_vars _self_vars
            :get-var  (fn [var-name] ((keyword var-name) @_self_vars))
            :set-var! (fn [var-name val] (swap! _self_vars assoc (keyword var-name) val)))

(compnt-let turtle-set []
            [_turtle_set (fn [] (atom #{}))]
            :_turtle_set _turtle_set
            :turtles (fn [] @_turtle_set))

(compnt-let turtle-getters []
            [turtles :turtles]
            :turtles-here (fn [] (turtles))
            :breed-here (fn [breed-name] (r/filter #(= (.getBreedName %) breed-name) (turtles))))

(compnt-let turtles-at []
        [patch-at :patch-at]
        :turtles-at (fn [x y] (((patch-at x y) :turtles-here))))

(compnt-let turtle-tracking []
            [_turtle_set :_turtle_set]
            :track-turtle   (fn [turtle] (swap! _turtle_set conj turtle))
            :untrack-turtle (fn [turtle] (swap! _turtle_set disj turtle)))


