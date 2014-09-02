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
                                  sprout-turtles
                                  patch-topology
                                  ask
                                  watch
                                  compare-by-id
                                  patch-to-string
                                  patch-reset
                                  cl-update]]))

;; Persisting issues -- JTT (8/29/14)
;;
;; * Can't pass a set of agents.patch-s to in-radius
;;              (or to anything else taking an agentset)
;; * Aliasing -> patchset of basically the same thing
;;

(def PATCH_NAME "patch")
;; REFER: poorly spliced update mapping in
;; cl-shiv/updater-hackpatch-cl.js -- 8/29/14

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
                   (sprout-turtles)
                   (patch-topology)
                   (ask)
                   (watch)
                   (compare-by-id)
                   (patch-to-string)
                   (patch-reset)
                   (cl-update)])))
