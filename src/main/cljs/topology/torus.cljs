(ns topology.torus
  (:require [util.etc :refer [js-err]]
            [lib.entity :refer [entity* entity-init]]
            [topology.comps :refer [bounds
                                    dimensions
                                    wrap
                                    patch-getter
                                    compass-movement
                                    neighborhood-finders
                                    shortest-nonsense-finders
                                    distance-finders
                                    towards
                                    midpoint-fns
                                    random-cor-generators
                                    aliases
                                    spliced-torus
                                    spliced-diffuse
                                    spliced-in-radius]])
  (:require-macros [lib.component :refer [compnt-let]]))

(defn torus [mnx mxx mny mxy]
  (entity-init (entity* :torus
           :init [(bounds mnx mxx mny mxy)
                  (dimensions)
                  (wrap)
                  (patch-getter)
                  (compass-movement)
                  (neighborhood-finders)
                  (shortest-nonsense-finders)
                  (distance-finders)
                  (towards)
                  (midpoint-fns)
                  (random-cor-generators)
                  (spliced-torus)
                  (spliced-diffuse)
                  (spliced-in-radius)
                  (aliases)])))

(defn js-torus [mnx mxx mny mxy]
  (clj->js (torus mnx mxx mny mxy)))

(((entity-init (torus -5 5 -5 5)) :wrap-x) 6)

;; js compat

(compnt-let torus-diffuse-js []
  [gpn :north
   gpe :east
   gps :south
   gpw :west

   gpne :northeast
   gpse :southeast
   gpsw :southwest
   gpnw :northwest]

  :diffuse-js
           (fn [var coefficient]
             (let [patches (.. js/workspace -world patches iterator toArray)]
               (for [p patches]
                 (let [x (.-pxcor p)
                       y (.-pycor p)
                       ;; ordering has to match what headless expects
                       ;; so cannot use (get-neighbors) -- JTT (8/11/14)
                       n [(gpsw x y)
                          (gpw x y)
                          (gpnw x y)
                          (gps x y)
                          (gpn x y)
                          (gpse x y)
                          (gpe x y)
                          (gpne x y)]
                       diffusal-sum (reduce +
                                            (map (fn [nb] (.getVariable
                                                           (topology.patch-math/xy->1d
                                                            (.-pxcor nb)
                                                            (.-pycor nb))
                                                           var)) n))
                       own-amt* (* (.getVariable p var) (- 1.0 coefficient))
                       to-diffuse (-> diffusal-sum (/ 8) (* coefficient))
                       new-amt (+ own-amt* to-diffuse)]
                   (.setVariable p var new-amt))))))

;; TODO: when more has been reimplemented, use the for-loop macro
;; to return either the new patchset or a list of updates to
;; perform. ie, don't mutate here. -- JTT (8/11/14)
;; TODO: take the patch-grabbing logic from world to reduce patch
;; arrays to one dimension -- JTT (8/11/14)
