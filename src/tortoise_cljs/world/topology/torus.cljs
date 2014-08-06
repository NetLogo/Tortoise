(ns topology.torus
  (:require [topology.patch-math]
            [topology.vars :refer [min-pycor min-pxcor max-pxcor max-pycor wrap-in-x? wrap-in-y?]]
            [util.etc :refer [js-err]])
  (:require-macros [topology.core :refer [inheritant-bind]]
                   [util.macros :refer [memoizer]]))

;; get-patch-north = memoize _get_patch_north
;; and so on...

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

;; instantiate a record within inheritant-bind - does it retain access to those values?
