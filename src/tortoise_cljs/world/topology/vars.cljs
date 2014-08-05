(ns world.topology.vars)

;;(declare-dyn max_pxcor
;;             min_pxcor
;;             max_pycor
;;             min_pycor
;;             wrap_in_x?
;;             wrap_in_y?)

;; declare-dyn doesn't work bc CLJS doesn't
;; allow vars to be declared;
;; they just default to nil. Which is,
;; I guess, arguably better than undefined. just
;; not as descriptive.

(def $UNBOUND "UNBOUND")

(def ^:dynamic max-pxcor  $UNBOUND)
(def ^:dynamic min-pxcor  $UNBOUND)
(def ^:dynamic max-pycor  $UNBOUND)
(def ^:dynamic min-pycor  $UNBOUND)
(def ^:dynamic wrap-in-x? $UNBOUND)
(def ^:dynamic wrap-in-y? $UNBOUND)

(defn bounds []
  [ min-pxcor
    max-pxcor
    min-pycor
    max-pycor ])

(def topologies
  {:NONE "In the beginning, there was...",
   :TORUS 'topology.torus})

(def terraformer
  {:TORUS (fn [] topology.torus.create)})

(defn ^:private _set_bounds! [x1 x2 y1 y2]
  (set! min-pxcor x1)
  (set! max-pxcor x2)
  (set! min-pycor y1)
  (set! max-pycor y2))
