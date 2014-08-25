(ns topology.comps
  (:require [shim.strictmath]
            [topology.patch-math :as pm]
            [engine.core.topology.torus])
  (:require-macros [lib.component :refer [compnt
                                          compnt-let]]))

(compnt bounds [mnx mxx mny mxy]
      :min-pxcor mnx
      :max-pxcor mxx
      :min-pycor mny
      :max-pycor mxy
      :edge-bounds (pm/compute-edges mnx mxx
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
            :wrap-x (fn [x] (pm/wrap x (:min-pxcor eb) (:max-pxcor eb))))

(compnt-let wrap-y []
            [eb :edge-bounds]
            :wrap-y (fn [y] (pm/wrap y (:min-pycor eb) (:max-pycor eb))))

(compnt-let wrap []

        [mnxe [:edge-bounds :min-pxcor]
         mxxe [:edge-bounds :max-pxcor]
         mnye [:edge-bounds :min-pycor]
         mxye [:edge-bounds :max-pycor]]

        :wrap-x (fn [x] (pm/wrap x mnxe mxxe))
        :wrap-y (fn [y] (pm/wrap y mnye mxye)))

(compnt patch-getter []
        :get-patch (fn [x y] (.getPatchAt js/workspace.world x y))
        :get-patches (fn [] (.. js/workspace -world patches iterator toArray)))

(compnt-let compass-movement []

            [wrap-x :wrap-x
             wrap-y :wrap-y
             gp     :get-patch]

            :north (fn [x y] (gp x (wrap-y (inc y))))
            :east  (fn [x y] (gp (wrap-x (inc x)) y))
            :south (fn [x y] (gp x (wrap-y (dec y))))
            :west  (fn [x y] (gp (wrap-x (dec x)) y))

            :northeast (fn [x y] (gp (wrap-x (inc x)) (wrap-y (inc y))))
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

(compnt-let shortest-nonsense-finders []

            [w :width
             h :height]

            :shortest-x (fn [x1 x2]
                          (pm/shortest-nonsense-helper x1 x2 w))
            :shortest-y (fn [y1 y2]
                          (pm/shortest-nonsense-helper y1 y2 h)))

(compnt-let distance-finders []

            [shtx :shortest-x
             shty :shortest-y]

            :distance-xy (fn [x1 x2 y1 y2]
                           (pm/distance-helper x1 x2 y1 y2 shtx shty))
            :distance (fn [x y agent]
                        (let [[ax ay] (.getCoords agent)]
                          (pm/distance-helper x y ax ay shtx shty))))

(compnt-let towards []

            [shtx :shortest-x
             shty :shortest-y]

            :towards (fn [x1 x2 y1 y2]
                       (pm/towards x1 x2 y1 y2 shtx shty)))

(compnt-let midpoint-fns []

            [shtx    :shortest-x
             shty    :shortest-y
             wrap-x  :wrap-x
             wrap-y  :wrap-y]

            :midpointx (fn [x1 x2]
                         (wrap-x
                           (pm/midpoint x1 x2 shtx)))
            :midpointy (fn [y1 y2]
                         (wrap-y
                           (pm/midpoint y1 y2 shty))))

(compnt-let in-radius []

            [t :topology]

            :in-radius (fn [x y agents radius]
                         (.inRadius t x y agents radius dist)))

(compnt-let random-cor-generators []

        [mnx :min-pxcor
         mxx :max-pxcor
         mny :min-pycor
         mxy :max-pycor
         wx  :wrap-x
         wy  :wrap-y]

        :random-x (fn [] (wx (pm/random-cor mnx mxx)))
        :random-y (fn [] (wy (pm/random-cor mny mxy))))

(compnt-let spliced-torus []

        [mnx :min-pxcor
         mxx :max-pxcor
         mny :min-pycor
         mxy :max-pycor]

        :topology (engine.core.topology.torus. mnx mxx mny mxy))

(compnt-let dimension-flattener []

            [mnx :min-pxcor
             mny :min-pycor
             w   :width]

            :xy->i (fn [x y] ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Aliases                                                       ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(compnt-let aliases []
            [wx :wrap-x
             wy :wrap-y

             mnx :min-pxcor
             mxx :max-pxcor
             mny :min-pycor
             mxy :max-pycor

             dxy :distance-xy

             gn  :get-neighbors
             gn4 :get-neighbors-4

             inr :in-radius

             rnx :random-x
             rny :random-y

             d   :diffuse-js]

            ;; Tortoise proper fns

            :wrapX wx
            :wrapY wy

            :minPxcor mnx
            :maxPxcor mxx
            :minPycor mny
            :maxPycor mxy

            :distanceXY dxy

            :getNeighbors  (fn [x y] (clj->js (doall (gn x y))))
            :getNeighbors4 (fn [x y] (clj->js (doall (gn4 x y))))

            :inRadius inr

            :randomXcor rnx
            :randomYcor rny

            :diffuse (fn [v c] (clj->js (doall (d v c)))))
