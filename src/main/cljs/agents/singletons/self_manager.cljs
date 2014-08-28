(ns agents.singletons.self-manager)

(def ^:dynamic ^:private _self 0)
(def ^:dynamic ^:private _myself 0)

(defn ask-agent [f]
  (fn [agent]
    (binding [_myself _self
              _self agent]
      (try (f)
        ;; NOTE:
        ;; in clojurescript, js/Object = Exception
        ;; write to log by (.log js/console e)
        ;;
        ;; also this error handling is not appropos
        ;;
        ;; By the way: if i output to js/console,
        ;; I will break the tests
        ;; ... so don't do that. (7/18/2014)
        (catch js/Error error (throw error))))))

(defn self [] @_self)

(defn myself [] @_myself)
