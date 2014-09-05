(ns agents.singletons.self-manager
  (:require [util.exception]))

;; REFER: cl-shiv/workspace-shiv-cl.js contains a hacked
;; modification to use the agents.singletons.self-manager
;; version of selfmanager in lieu of engine.core.selfmanager
;; -- JTT 9/3/14

(def ^:dynamic ^:private _self 0)
(def ^:dynamic ^:private _myself 0)

(defn ask-agent [f]
  (fn [agent]
    (binding [_myself _self
              _self   agent]
      (try (f)
        ;; catch DeathInterrupt and StopInterrupt from util.exception -- JTT 9/4/14
        (catch :default error (when (not (or (instance? util.exception.DeathInterrupt error)
                                             (instance? util.exception.StopInterrupt error)))
                                (throw error)))))))

;; cl-alias -- JTT 9/3/14
(defn askAgent [f] (ask-agent f))

(defn self [] _self)

(defn myself [] _myself)
