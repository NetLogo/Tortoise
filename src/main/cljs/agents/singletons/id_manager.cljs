(ns agents.singletons.id-manager)

;;
;; id-manager keeps track of how many twurtels have been
;; hatched and therefore can always tell a new twurtel
;; what its id should be. (7/17/2014)
;;

(def ^:private managed-entities (atom {}))

(defprotocol Iid-manager
  (next-id      [_])
  (reset        [_])
  (restore-prev [_]))

(deftype id-manager [_count _prev_count]
  Iid-manager
  (next-id      [_] (swap! _count inc))
  (reset        [_] (reset! _count 0))
  (restore-prev [_] (reset! _count @_prev_count)))

(defn init-watch [im] (let [_count (.-_count im)
                            _prev_count (.-_prev_count im)]
                        (add-watch _count :prev
                          (fn [_key _ref old-state _new-state]
                            (reset! _prev_count old-state)))))

(defn create-id-manager []
  (let [im (id-manager. (atom 0) (atom 0))]
    (init-watch im)
    im))

(defn add-entity-id-manager [entity-name]
  (swap! managed-entities assoc entity-name (create-id-manager)))

(defn new-id! [e]
  (let [manager (get @managed-entities e)]
    (if (not (nil? manager))
      (next-id manager)
      (next-id (get (add-entity-id-manager e) e)))))

(defn reset-all! []
  (doseq [[_ idm] @managed-entities]
    (reset idm)))

;; I don't think NetLogo actually needs to be able to access
;; the _count currently, outside of running next-id. (7/17/2014)

;;
;; when world resizes, id-manager needs to not be cleared.
;; however everything else gets cleared.
;; hence the watch. (7/17/2014)
;;
