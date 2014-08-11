(ns util.math)

(defn clamp [v mn mx]
  (cond (> v mx) mx
        (< v mn) mn
        :default v))

(defn squash [v to precision]
  "squash 'v' to be 'to' if v - to < precision"
  (if (< (Math/abs (- v to))
         precision)
    to
    v))
