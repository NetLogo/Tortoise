(ns topology.vars)

;; declare-dyn doesn't work bc CLJS doesn't
;; allow vars to be declared;
;; they just default to nil.
;; -- JTT (8/11/2014)

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
  {:TORUS 'topology.torus})

(def terraformers
  {:TORUS (fn [] topology.torus.create)})

(defn ^:private _set_bounds! [x1 x2 y1 y2]
  (set! min-pxcor x1)
  (set! max-pxcor x2)
  (set! min-pycor y1)
  (set! max-pycor y2))
