'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var redux = require('redux');
var isNode = _interopDefault(require('detect-node'));
var invariant = _interopDefault(require('invariant'));
var reactRedux = require('react-redux');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * @param obj The object to inspect.
 * @returns True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (_typeof(obj) !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * 检测model是否符合规范
 * @param {Object} model
 * @param {Object} allModels
 */

function checkModel(model, allModels) {
  invariant(model.namespace, 'model.namespace: should be string');
  invariant(allModels[model.namespace] === undefined, "model.namespace: ".concat(model.namespace, " has been registered"));
  allModels[model.namespace] = model.namespace;

  if (model.reducers || model.state) ;

  if (model.effects) {
    invariant(isPlainObject(model.effects), "model.effects: should be PlainObject");
  }

  if (model.selectors) {
    invariant(typeof model.selectors === 'function', "model.selectors: should be function");
  }
}

/**
 * 创建reducer
 * @param {Object} model
 */
function createReducers(model) {
  var namespace = model.namespace,
      state = model.state,
      reducers = model.reducers; // 修改reducer键值 比如: add => `global/add`

  Object.keys(reducers).forEach(function (reducerKey) {
    model.reducers["".concat(namespace, "/").concat(reducerKey)] = reducers[reducerKey];
    delete model.reducers[reducerKey];
  });
  return function finalReducer() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var reduceFn = reducers[action.type];

    if (typeof reduceFn === 'function') {
      var nextState = reduceFn(initialState, action); // 如果新的state是undefined就抛出对应错误

      if (typeof nextState === 'undefined') {
        throw new Error('return state error！');
      }

      return nextState;
    }

    return initialState;
  };
}

var store = null;
var allReducer = {};
var allEffects = {};
var allModels = {};
/**
 * 动态注入reducer
 * @param {String} namespace
 * @param {Function} reducer
 */

function injectReducer(namespace, reducer) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error');
    }

    return;
  }

  if (!reducer || typeof reducer !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('reducer must be a function');
    }

    return;
  }

  allReducer[namespace] = reducer;

  if (store) {
    store.replaceReducer(redux.combineReducers(allReducer));
  }
}
/**
 * 动态注入effects
 * @param {String} namespace
 * @param {Function} effects
 */

function injectEffects(namespace, effects) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error');
    }

    return;
  }

  if (!effects || _typeof(effects) !== 'object' || Array.isArray(effects)) {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('effects must be a object');
    }

    return;
  }

  allEffects[namespace] = effects;
}

function createEffectsMiddle(effectsExtraArgument) {
  return function (store) {
    return function (_dispatch) {
      return function (action) {
        if (isPlainObject(action) && typeof action.type === 'string') {
          var type = action.type,
              args = _objectWithoutProperties(action, ["type"]);

          var actionType = action.type.split('/');
          var namespace = actionType[0];
          var actualtype = actionType[1];

          if (allEffects[namespace] && allEffects[namespace][actualtype]) {
            return allEffects[namespace][actualtype](_objectSpread2({
              dispatch: function dispatch(_ref) {
                var type = _ref.type,
                    rest = _objectWithoutProperties(_ref, ["type"]);

                return _dispatch(_objectSpread2({
                  type: "".concat(namespace, "/").concat(type)
                }, rest));
              }
            }, effectsExtraArgument), _objectSpread2({}, args));
          }

          return _dispatch(action);
        }

        return _dispatch(action);
      };
    };
  };
}

function demacia(_ref2) {
  var initialState = _ref2.initialState,
      initialModels = _ref2.initialModels,
      _ref2$middlewares = _ref2.middlewares,
      middlewares = _ref2$middlewares === void 0 ? [] : _ref2$middlewares,
      _ref2$effectsExtraArg = _ref2.effectsExtraArgument,
      effectsExtraArgument = _ref2$effectsExtraArg === void 0 ? {} : _ref2$effectsExtraArg;

  // 初始model
  if (isPlainObject(initialModels)) {
    for (var key in initialModels) {
      var initialModel = initialModels[key];

      if (isPlainObject(initialModel)) {
        if (!isNode) {
          checkModel(initialModel, allModels);
        }

        if (initialModel.reducers) {
          var reducer = createReducers(initialModel);
          injectReducer(initialModel.namespace, reducer);
        }

        if (initialModel.effects) {
          injectEffects(initialModel.namespace, initialModel.effects);
        }
      }
    }
  } // effects处理的中间件


  var effectsMiddle = createEffectsMiddle(effectsExtraArgument);
  var composeEnhancers = redux.compose;

  if (!isNode) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
  } // 创建store


  store = redux.createStore(redux.combineReducers(allReducer), initialState, composeEnhancers(redux.applyMiddleware.apply(void 0, [effectsMiddle].concat(_toConsumableArray(middlewares)))));
  return store;
}

/**
 * 处理model
 * @param {Object} model
 */

function createModel(model) {
  if (!isNode) {
    checkModel(model, allModels);
  }

  var selectors = null;

  if (model.selectors) {
    selectors = function selectors(state) {
      return model.selectors(state);
    };
  }

  if (model.reducers) {
    var reducer = createReducers(model);
    injectReducer(model.namespace, reducer);
  }

  if (model.effects) {
    injectEffects(model.namespace, model.effects);
  }

  return {
    selectors: selectors
  };
}

/**
 *
 * @param {Object} model
 * {
 *  namespace, // model 命名空间
 *  state, 初始值
 *  reducers，唯一可以修改state的地方，由action触发
 *  effects，用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
 * }
 */

function model(model) {
  var _createModel = createModel(model),
      selectors = _createModel.selectors;

  function Wrap(Component) {
    return reactRedux.connect(selectors)(Component);
  }

  return Wrap;
}

exports.demacia = demacia;
exports.model = model;
