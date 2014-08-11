(ns util.math)

(defn squash [v to precision]
  "squash 'v' to be 'to' if v - to < precision"
  (if (< (Math/abs (- v to))
         precision)
    to
    v))
