(ns lib.entity
  (:require-macros [lib.component :refer [compnt bounds let-in]]))

(defmacro entity [nm params & state]
  `(defn ~nm ~params
     (let [~'e (transient {})]
       (doseq [~'fs ~(get (conj {} (vec state)) :param-init)]
         (conj! ~'e (~'fs ~'e)))
     (persistent! ~'e))))

(defn entity* [nm & state]
  (let [e (transient {})]
    (doseq [bit (partition-all 2 state)]
      (conj! e (vec bit)))
    (assoc! e :name (name nm))))

(defn entity-init [e]
  (let [n (transient {})]
    (doseq [ifs (:init e)]
      (conj! n (ifs n)))
    (persistent! n)))

(defn compute-edges [mnx mxx mny mxy]
  {:min-pxcor (- mnx 0.5)
   :max-pxcor (+ mxx 0.5)
   :min-pycor (- mny 0.5)
   :max-pycor (+ mxy 0.5)})

;; would like to be able to write
;; (comp bounds [blah blah...]
;;   :min-pxcor blah
;;   ... )
;; (comp edge-bounds [blah blah ...]
;;   :min-pxcor blah
;;   ... )
;;
;; and be returned the fn.
;; -- JTT (8/18/14)

(defn wrap
  ([] (fn [e] (let-in e [eb :edge-bounds]
                { :wrap-x (fn [x] (topology.patch-math/wrap x (:min-pxcor eb)
                                                              (:max-pxcor eb)))
                  :wrap-y (fn [y] (topology.patch-math/wrap y (:min-pycor eb)
                                                              (:max-pycor eb)))}))))

(compnt bounds [mnx mxx mny mxy]
      :min-pxcor mnx
      :max-pxcor mxx
      :min-pycor mny
      :max-pycor mxy
      :edge-bounds (compute-edges mnx mxx
                                  mny mxy))

(defn torus [mnx mxx mny mxy]
  (entity* :torus
           :init [(bounds mnx mxx mny mxy)
                  (wrap)]))

((:wrap-x (entity-init (torus -5 5 -5 5))) 5.5)
