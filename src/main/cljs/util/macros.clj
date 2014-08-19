(ns util.macros)

(defn _to- [_] (->> _
                    str
                    rest
                    (replace {\_ \-})
                    clojure.string/join))

(defmacro memoizer
  ([name-gen nsp fun]
     `(def (~name-gen ~fun)
        `(memoize (symbol (str ~~nsp ~~fun)))))
  ([nsp fun]
    (let [ nfn #(symbol (_to- %))]
      `(def ~(nfn fun) (memoize ~(symbol (str nsp "/" fun))))))
  ([fun]
    (let [ nfn #(symbol (_to- %)) ]
      `(def ~(nfn fun) (memoize ~fun)))))
