(ns topology.torus
  (:require [topology.vars :refer [min-pycor min-pxcor
                                   max-pxcor max-pycor
                                   wrap-in-x? wrap-in-y?]]
            [util.etc :refer [js-err]])
  (:require-macros [topology :refer [inheritant-bind]]
                   [util.macros :refer [memoizer]]))

(defn init []
    (do (set! wrap-in-x? true)
        (set! wrap-in-y? true)))

(defn create
  ([]
    (inheritant-bind
     [ ]
     (if (some #(= % topology.vars.$UNBOUND) (topology.vars.bounds))
       (js-err "$UNBOUND in world bounds")
       (create min-pxcor max-pxcor min-pycor max-pycor))))
  ([mnx mxx mny mxy]
    (inheritant-bind
     [ min-pxcor mnx
       max-pxcor mxx
       min-pycor mny
       max-pycor mxy ]
     (init))))

;; diffuse sucks.

(defn diffuse [var coefficient]
  (for [p (world.patches)]
    ((:get-variable p) var)))

;; js compat

(defn diffuse-js [var coefficient]
;;  (letfn [(get-source-patches []
;;            (for [p (.patches engine.core.world)]
;;              (.getVariable p var)))]
;;     (let [source-patches (get-source-patches)]
       (for [p (.patches engine.core.world)]
         (let [x (.-pxcor p)
               y (.-pycor p)
               n [(get-patch-southwest x y)
                  (get-patch-west x y)
                  (get-patch-northwest x y)
                  (get-patch-south x y)
                  (get-patch-north x y)
                  (get-patch-southeast x y)
                  (get-patch-east x y)
                  (get-patch-northeast x y)]
               diffusal-sum (reduce +
                              (map (fn [nb] (.getVariable nb var))
                                   (.patches engine.core.world)))
               own-amt* (* (.getVariable p var) (- 1.0 coefficient))
               to-diffuse (-> diffusal-sum (/ 8) (* coefficient))
               new-amt (+ own-amt* to-diffuse)]
           (.setVariable p var new-amt))))

;; TODO: when more has been reimplemented, use the for-loop macro
;; to return either the new patchset or a list of updates to
;; perform.
;; TODO: take the patch-grabbing logic from world

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Aliases                                                       ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; tortoise proper expects

;; height
;; width
;; minPxcor maxPxcor minPycor maxPycor
;; diffuse
;; wrapX wrapY
;; distance
;; distanceXY
;; getNeighbors
;; getNeighbors4
;; inRadius
;; midpointx/y
;; towards
