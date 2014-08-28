(ns agents.patch
  (:require [lib.entity :refer [entity*
                                entity-init]]
            [agents.comps :refer [indexed
                                  self-vars
                                  patch-coordinates
                                  turtle-set
                                  turtle-getters
                                  turtles-at
                                  turtle-tracking
                                  patch-topology
                                  ask
                                  watch
                                  patch-reset]]))

;; Components and pieces -- JTT (8/26/14)
;;
;; has self-vars
;; - pcolor
;; - pxcor
;; - pycor
;; - plabel
;; - plabel-color
;; contains turtles
;; - special turtle operations
;; - - get turtleset
;; - - "sprout" turtle
;; - - un/track turtle
;; coordinates
;; patch-math
;; - distance-xy (distance-finders)
;; - distance
;; - towardsXY
;; - get-neighbors-4 (neighborhood-finders)
;; - get-neighbors
;; - in-radius (spliced-in-radius)
;; ask-able
;; watch-able (by observer)
;; comparable (by id)
;; "reset" (return fresh empty patch)
;; getters and setters for builtins

;; SCAFFOLDING -- JTT (8/26/14)
(def patch-defaults
  {:pcolor 0
   :plabel ""
   :plabel-color 9.9})

(defn patch [x y]
  (entity-init
   (entity* :patch
            :init [(indexed :patch)
                   (self-vars patch-defaults)
                   (patch-coordinates x y)
                   (turtle-set)
                   (turtle-getters)
                   (turtles-at)
                   (turtle-tracking)
                   (patch-topology)
                   (ask)
                   (watch)
                   (patch-reset)])))
