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

(defmacro letc-in [e getblock & body]
  (let [letblock (transient [])]
    (doseq [[nm v] (partition-all 2 getblock)]
      (conj! letblock nm)
      (conj! letblock (get-in e (or (and (vector? v) v) [v]))))
    `(let ~(persistent! letblock) ~@body)))
