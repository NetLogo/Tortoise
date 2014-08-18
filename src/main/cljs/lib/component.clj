(ns lib.component)

;; borrowed from https://github.com/ibdknox/ChromaShift/blob/master/cljs/game/lib/macros.clj
;; -- JTT (8/18/14)

(defmacro component [name params & r]
  `(defn ~name ~params
     (clojure.core/js-obj "name" ~(keyword (clojure.core/name name)) ~@r)))

(defmacro compnt [nm params & kvs]
  (letfn
    [(czip [e]
       (let [c (transient {})]
         (doseq [[k cfs] (partition-all 2 kvs)]
           (conj! c [k cfs]))
         (persistent! c)))]
    `(defn ~nm ~params
       (fn [~'e] ~(czip 'e)))))

(compnt bounds [mnx mxx mny mxy]
      :min-pxcor mnx
      :max-pxcor mxx
      :min-pycor mny
      :max-pycor mxy)

(bounds -5 5 -5 5)
