(ns topology.topology
  (:require [util.macros :refer [memoizer add-patch-math-fn]]))

(defmacro def-width []
  '(def width (inc (- max-pxcor min-pxcor))))

(defmacro def-height []
  '(def height (inc (- max-pycor min-pycor))))

(defmacro memo-patch-math [fun] `(memoizer ~'topology.patch-math ~fun))

(defmacro memo-get-neighbors-4 []
  '(defn get-neighbors-4 [x y]
     (filter #(not= % nil)
             [(get-patch-north x y)
              (get-patch-east  x y)
              (get-patch-south x y)
              (get-patch-west  x y)])))

(defmacro memo-get-neighbors []
  '(defn get-neighbors [x y]
     (concat
       (get-neighbors-4 x y)
       (filter #(not= % nil)
               [(get-patch-northeast x y)
                (get-patch-southeast x y)
                (get-patch-southwest x y)
                (get-patch-northwest x y)]))))

(defmacro inheritant-bind [bind-block & body]
  `(binding ~bind-block
     (def-width)
     (def-height)
     (memo-patch-math ~'_get_patch_north)
     (memo-patch-math ~'_get_patch_east)
     (memo-patch-math ~'_get_patch_south)
     (memo-patch-math ~'_get_patch_west)
     (memo-patch-math ~'_get_patch_northeast)
     (memo-patch-math ~'_get_patch_southeast)
     (memo-patch-math ~'_get_patch_northwest)
     (memo-patch-math ~'_get_patch_southwest)
     (memo-get-neighbors-4)
     (memo-get-neighbors)
     (add-patch-math-fn ~'wrap-x)
     (add-patch-math-fn ~'wrap-y)
     (add-patch-math-fn ~'distance-xy)
     (add-patch-math-fn ~'distance)
     (add-patch-math-fn ~'shortest-x)
     (add-patch-math-fn ~'shortest-y)
     (add-patch-math-fn ~'midpoint-x)
     (add-patch-math-fn ~'midpoint-y)
     (add-patch-math-fn ~'in-radius)
     (add-patch-math-fn ~'towards)
     (add-patch-math-fn ~'random-x)
     (add-patch-math-fn ~'random-y)
     ~@body))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Aliases                                                       ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defmacro def-aliases []
  '(do
    (def minPxcor min-pxcor)
    (def maxPxcor max-pxcor)
    (def minPycor min-pycor)
    (def maxPycor max-pycor)

    (def wrapX wrap-x)
    (def wrapY wrap-y)

    (def distanceXY distance-xy)

    (def inRadius in-radius)

    (def shortestX shortest-x)
    (def shortestY shortest-y)

    (def midpointx midpoint-x)
    (def midpointy midpoint-y)

    ;; getNeighbors and getNeighbors4 and getPatchNESW-etc
    ;; don't exist until memoization occurs in topology.topology,
    ;; so... it's kinda gross, but these are all "null" by default.
    ;; -- JTT (8/11/14)

    (def getNeighbors4   get-neighbors-4)
    (def getNeighbors    get-neighbors)

    (def getPatchNorth   get-patch-north)
    (def getPatchSouth   get-patch-south)
    (def getPatchEast    get-patch-east)
    (def getPatchWest    get-patch-west)

    (def getPatchNortheast get-patch-northeast)
    (def getPatchNorthwest get-patch-northwest)
    (def getPatchSoutheast get-patch-southeast)
    (def getPatchSouthwest get-patch-southwest)

    (def randomXcor random-x)
    (def randomYcor random-y)))
