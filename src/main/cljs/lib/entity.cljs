(ns lib.entity)

(defn entity* [nm & state]
  (let [e (transient {})]
    (doseq [bit (apply hash-map state)]
      (conj! e (vec bit)))
    (assoc! e :name (name nm))))

(defn entity-init [e]
  (loop [ifs (:init e)
         n   {}
         f (first ifs)]
    (if (nil? f)
      n
      (recur (drop 1 ifs) (conj n (f n)) (second ifs)))))
