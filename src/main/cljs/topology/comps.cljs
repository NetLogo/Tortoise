(ns topology.comps
  (:require [shim.strictmath])
  (:require-macros [lib.component :refer [compnt compnt-let]]))

(defn compute-edges [mnx mxx mny mxy]
  {:min-pxcor (- mnx 0.5)
   :max-pxcor (+ mxx 0.5)
   :min-pycor (- mny 0.5)
   :max-pycor (+ mxy 0.5)})

(compnt bounds [mnx mxx mny mxy]
      :min-pxcor mnx
      :max-pxcor mxx
      :min-pycor mny
      :max-pycor mxy
      :edge-bounds (compute-edges mnx mxx
                                  mny mxy))

(compnt-let dimensions []

            [mnx :min-pxcor
             mxx :max-pxcor
             mny :min-pycor
             mxy :max-pycor]

            :width  (inc (- mxx mnx))
            :height (inc (- mxy mny)))

(compnt-let wrap-x []
            [eb :edge-bounds]
            :wrap-x (fn [x] (topology.patch-math/wrap x (:min-pxcor eb) (:max-pxcor eb))))

(compnt-let wrap-y []
            [eb :edge-bounds]
            :wrap-y (fn [y] (topology.patch-math/wrap y (:min-pycor eb) (:max-pycor eb))))

(compnt-let wrap []

        [eb :edge-bounds]

        :wrap-x (fn [x] (topology.patch-math/wrap x (:min-pxcor eb) (:max-pxcor eb)))
        :wrap-y (fn [y] (topology.patch-math/wrap y (:min-pycor eb) (:max-pycor eb))))

(compnt patch-getter [x y]
        :get-patch (fn [x y] (conj ['.getPatchAt 'workspace.world] x y)))

(compnt-let compass-movement []

            [wrap-x :wrap-x
             wrap-y :wrap-y
             gp     :get-patch]

            :north (fn [x y] (gp x (wrap-y (inc y))))
            :east  (fn [x y] (gp (wrap-x (inc x)) y))
            :south (fn [x y] (gp x (wrap-y (dec y))))
            :west  (fn [x y] (gp (wrap-x (dec x)) y))

            :northeast (fn [x y] (gp (wrap-x (inc x)) (wrap-y (inc x))))
            :southeast (fn [x y] (gp (wrap-x (inc x)) (wrap-y (dec y))))
            :southwest (fn [x y] (gp (wrap-x (dec x)) (wrap-y (dec y))))
            :northwest (fn [x y] (gp (wrap-x (dec x)) (wrap-y (inc y)))))

(compnt-let neighborhood-finders []

            [gpn :north
             gpe :east
             gps :south
             gpw :west

             gpne :northeast
             gpse :southeast
             gpsw :southwest
             gpnw :northwest]

            :get-neighbors-4 (fn [x y] (filter #(not= % nil)
                                               ((juxt gpn gpe gps gpw) x y)))
            :get-neighbors (fn [x y] (filter #(not= % nil)
                                             ((juxt gpn gpe gps gpw
                                                    gpne gpse gpsw gpnw) x y))))

(defn shortest-nonsense-helper [d1 d2 w-or-h]
  "Madness, this."
  (let [mag (shim.strictmath.abs (- d1 d2))
        negmod (or (and (> d2 d1) -1) 1)]
    (if (-> mag (> (/ w-or-h 2)))
      (-> w-or-h (- mag) (* negmod))
      (* mag (- negmod)))))

(compnt-let shortest-nonsense-finders []

            [w  :width
             h  :height]

            :shortest-x (fn [x1 x2]
                          (shortest-nonsense-helper x1 x2 w))
            :shortest-y (fn [y1 y2]
                          (shortest-nonsense-helper y1 y2 h)))

(defn distance-helper [x1 x2 y1 y2 sx sy]
  (let [a2 (shim.strictmath.pow (sx x1 x2) 2)
        b2 (shim.strictmath.pow (sy y1 y2) 2)]
    (shim.strictmath.sqrt (+ a2 b2))))

(compnt-let distance-finders []

            [shtx :shortest-x
             shty :shortest-y]

            :distance-xy (fn [x1 x2 y1 y2]
                           (distance-helper x1 x2 y1 y2 shtx shty))
            :distance (fn [x y agent]
                        (let [[ax ay] (.getCoords agent)]
                          (distance-helper x y ax ay shtx shty))))
