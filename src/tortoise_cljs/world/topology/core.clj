(ns world.topology.core
  (:require [util.macros :refer [memoizer]]))

;; hand topology the functions it needs from world
;; (I believe all it should need is get-patch-at)

;; funcs (will be implemented in patch-math)
;;
;; distanceXY (x1, y1, x2, y2)
;; distance (x, y, agent)
;; towards (x1, y1, x2, y2)
;; midpointx
;; midpointy
;; inRadius (x, y, agents, radius)

;; abstract methods
;;
;; shortestX ;;wrapped vs origin distance btwn pnts
;; shortestY

;; def members when inheritant-bind is called.
;;
;; members
;;
;; width
;; height

(defmacro def-width []
  '(def width (- max-pxcor min-pxcor)))

(defmacro def-height []
  '(def height (- max-pycor min-pycor)))

(defmacro memo-patch-math [fun] `(memoizer ~'world.topology.patch-math ~fun))

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
     ~@body))
