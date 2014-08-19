(ns topology.torus
  (:require [util.etc :refer [js-err]]
            [topology.patch-math :refer [_get_patch_north
                                         _get_patch_east
                                         _get_patch_south
                                         _get_patch_west
                                         _get_patch_northeast
                                         _get_patch_southeast
                                         _get_patch_southwest
                                         _get_patch_southeast]]
            [lib.entity :refer [entity* entity-init]]
            [topology.comps :refer [bounds
                                    dimensions
                                    wrap
                                    patch-getter
                                    compass-movement
                                    neighborhood-finders
                                    shortest-nonsense-finders]])
  (:require-macros [lib.component :refer [compnt compnt-let]]))

(defn torus [mnx mxx mny mxy]
  (entity* :torus
           :init [(bounds mnx mxx mny mxy)
                  (dimensions)
                  (wrap)
                  (patch-getter)
                  (compass-movement)
                  (neighborhood-finders)
                  (shortest-nonsense-finders)]))

(torus -5 5 -5 5)

(((entity-init (torus -5 5 -5 5)) :wrap-x) 6)

;; js compat

(defn diffuse-js [var coefficient]
  (for [p (.patches engine.core.world)]
    (let [x (.-pxcor p)
          y (.-pycor p)
          ;; ordering has to match what headless expects
          ;; so cannot use (get-neighbors) -- JTT (8/11/14)
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
                                    (.patches workspace.world)))
          own-amt* (* (.getVariable p var) (- 1.0 coefficient))
          to-diffuse (-> diffusal-sum (/ 8) (* coefficient))
          new-amt (+ own-amt* to-diffuse)]
      (.setVariable p var new-amt))))

;; TODO: when more has been reimplemented, use the for-loop macro
;; to return either the new patchset or a list of updates to
;; perform. ie, don't mutate here. -- JTT (8/11/14)
;; TODO: take the patch-grabbing logic from world to reduce patch
;; arrays to one dimension -- JTT (8/11/14)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Aliases                                                       ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; tortoise proper expects

;; height
;; width
;; diffuse

(def diffuse #(diffuse-js %1 %2))
