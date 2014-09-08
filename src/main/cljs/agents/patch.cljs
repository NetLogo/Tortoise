(ns agents.patch
  (:require [lib.entity :refer [entity*
                                entity-init]]
            [agents.comps :refer [indexed
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
                                  self-vars
                                  patches-own-vars
                                  nuanced-set-var-and-update
                                  *nuanced-set-var!
                                  cl-update]])
  (:require-macros [lib.component :refer [compnt-let]]))

;; Persisting issues -- JTT (8/29/14)
;;
;; * Can't pass a set of agents.patch-s to in-radius
;;              (or to anything else taking an agentset)
;; * Aliasing -> patchset of basically the same thing
;;

;; Currently failing tests as of 9/3/14 -- JTT
;;
;; Commands, Models
;; Failing in *Commands:
;; PatchSetNestedLists, AnyAll::All3, ComparingAgents::ComparingPatches, PatchAt::PatchAt, Sort::SortingListOfAgents
;;
;; Fixed tests so far:
;;
;; Agents, Breeds, Math, Topologies, Labels, Links
;;

(def PATCH_NAME "patch")
;; REFER: poorly spliced update mapping in
;; cl-shiv/updater-hackpatch-cl.js -- 8/29/14

(def patch-defaults
  {:pcolor 0
   :plabel ""
   :plabel-color 9.9})

(defn- _patch_entity [id x y world]
  (entity* :patch
           :id id
           ;; REFER: world-hackpatch-cl.js in cl-shiv
           :world world
           :init [;;(indexed :patch) ;; This is not working well with tortoise proper -- JTT 9/2/14
                  (patch-coordinates x y)
                  (patch-topology)
                  (turtle-set)
                  (turtle-getters)
                  (turtles-at)
                  (turtle-tracking)
                  (sprout-turtles)
                  (ask)
                  (watch)
                  (compare-by-id)
                  (patch-to-string)
                  (patch-reset)
                  (patches-own-vars)
                  (self-vars (merge patch-defaults {:pxcor x :pycor y}))
                  (nuanced-set-var-and-update)
                  (*nuanced-set-var!)
                  (cl-update)
                  (patch-aliases)]))

(defn patch [id x y world & others]
  (entity-init (merge (_patch_entity id x y world) (apply hash-map others))))

;; Must be able to pass UI optimizations (inc/dec PatchLabelCount, declarePatchesNotAllBlack, etc),
;; and hence the new variadic constructor. -- JTT 9/3/14
(defn js-patch [id x y world & optimizations]
  (clj->js (apply (partial patch id x y world) optimizations)))

(compnt-let patch-aliases []

            [get-var :get-var
             set-var! :set-var!

             track-turtle :track-turtle
             untrack-turtle :untrack-turtle

             get-coords :get-coords

             distance-xy :distance-xy
             towards-xy :towards-xy
             get-neighbors :get-neighbors
             get-neighbors-4 :get-neighbors-4
             in-radius :in-radius
             patch-at :patch-at

             turtles-at :turtles-at
             turtles-here :turtles-here
             breed-here :breed-here

             projection-by :projection-by

             to-string :to-string

             sprout! :sprout!]

            :getVariable get-var
            :setVariable set-var!

            :getPatchVariable get-var
            :setPatchVariable set-var!

            :untrackTurtle untrack-turtle
            :trackTurtle track-turtle

            :getCoords get-coords
            :distanceXY distance-xy
            :towardsXY towards-xy
            :getNeighbors get-neighbors
            :getNeighbors4 get-neighbors-4
            :inRadius in-radius
            :patchAt patch-at

            :turtlesAt turtles-at
            :turtlesHere turtles-here
            :breedHere breed-here

            :projectionBy projection-by

            :toString to-string

            :sprout sprout!)
