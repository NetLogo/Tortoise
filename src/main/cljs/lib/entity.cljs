(ns lib.entity)

(defn entity* [nm & state]
  (let [e (transient {})]
    (doseq [bit (partition-all 2 state)]
      (conj! e (vec bit)))
    (assoc! e :name (name nm))))

(defn entity-populate-defaults [e]
  (loop [defaults (:defaults e)
         n        (dissoc e :defaults)
         d        (first defaults)]
    (if (> (count defaults) 0)
      (recur (drop 1 defaults) (conj n d) (second defaults))
      n)))

(defn entity-init [e]
  (loop [ifs (:init e)
         n   (dissoc e :init)
         f   (first ifs)]
    (if (not (nil? f))
      (recur (drop 1 ifs) (conj n (f n)) (second ifs))
      n)))

(defmacro entity-inst [e]
  ((comp entity-populate-defaults
         entity-init) e))
