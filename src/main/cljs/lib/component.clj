(ns lib.component)

;; borrowed from https://github.com/ibdknox/ChromaShift/blob/master/cljs/game/lib/macros.clj
;; -- JTT (8/18/14)

(defmacro component [name params & r]
  `(defn ~name ~params
     (clojure.core/js-obj "name" ~(keyword (clojure.core/name name)) ~@r)))

(defn- czip [raw_kvs]
  (loop [kvs (vec (partition-all 2 raw_kvs))
         [k v] (first kvs)
         c  {}]
    (if (> (count kvs) 0)
      (recur (drop 1 kvs) (second kvs) (assoc c k v))
      c)))

(defmacro compnt [nm params & kvs]
  `(defn ~nm ~params
     (fn [~'e] ~(czip kvs))))

(defmacro compnt-let [nm params getblock & kvs]
  `(defn ~nm ~params
     (fn [~'e] (let-in ~'e ~getblock ~(czip kvs)))))

(defmacro let-in [e getblock & body]
  (let [letblock (transient [])]
    (doseq [[nm v] (partition-all 2 getblock)]
      (conj! letblock nm)
      (if (and (not (keyword? v)) (not (vector? v)))
        (conj! letblock `(~v))
        (conj! letblock `(get-in ~e (or (and (vector? ~v) ~v) [~v])))))
    `(let ~(persistent! letblock) ~@body)))
