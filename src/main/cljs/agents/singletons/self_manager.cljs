(ns agents.singletons.self-manager)

(def ^:dynamic ^:private _self 0)
(def ^:dynamic ^:private _myself 0)

(defn ask-agent [f]
  (fn [agent]
    (binding [_myself _self
              _self agent]
      (try (f)
        ;; Incomplete error handling. -- JTT (8/29/14)
        (catch js/Error error (throw error))))))

(defn self [] @_self)

(defn myself [] @_myself)
