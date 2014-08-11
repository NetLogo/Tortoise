(ns util.etc)

(defn js-err [msg & so-on]
  (.error js/console (apply (partial js-obj "type" "ERROR" "msg" msg ) so-on)))
