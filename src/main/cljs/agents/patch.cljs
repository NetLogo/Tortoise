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
                                  compare-by-id
                                  patch-to-string
                                  patch-reset
                                  cl-patch-update]]))

;; Components and pieces still remaining -- JTT (8/28/14)
;;
;; contains turtles
;; - special turtle operations
;; - - "sprout" turtle
;; patch-math
;; - in-radius (spliced-in-radius)

(def PATCH_NAME "patch")

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
                   (compare-by-id)
                   (patch-to-string)
                   (patch-reset)
                   (cl-patch-update)])))
