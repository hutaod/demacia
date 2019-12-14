import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import isNode from 'detect-node';
import _typeof from '@babel/runtime/helpers/esm/typeof';

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var store;
var rootReducers = {};
var rootEffects = {}; // 动态注入reducer

var addReducer = function addReducer(key, reducer, effects) {
  if (!key || typeof key !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error');
    }

    return;
  }

  if (!reducer || typeof reducer !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error');
    }

    return;
  }

  if (rootReducers[key]) {
    throw Error('reducer has exist');
  }

  rootReducers[key] = reducer;
  rootEffects[key] = effects;

  if (store) {
    store.replaceReducer(combineReducers(rootReducers));
  }
};
/**
 *
 * @param {Object} options
 * {
 *  namespace, // model 命名空间
 *  state, 初始值
 *  reducers，唯一可以修改state的地方，由action触发
 *  effects，用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
 * }
 */

var model = function model(_ref) {
  var namespace = _ref.namespace,
      state = _ref.state,
      reducers = _ref.reducers,
      effects = _ref.effects;

  if (typeof namespace !== 'string' || namespace.trim().length === 0) {
    console.error('namespace not exist');
    return;
  }

  if (typeof state !== 'undefined') {
    var reducer = function reducer() {
      var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      // console.log(action.type)
      var typeArr = action.type.split('/'); // 判断reducers是是符合要求的对象，并且判断action.type是否符合要求

      if (isPlainObject(reducers) && typeArr[0] === namespace) {
        var callFunc = reducers[typeArr[1]];

        if (typeof callFunc === 'function') {
          var nextState = callFunc(prevState, action); // 如果新的state是undefined就抛出对应错误

          if (typeof nextState === 'undefined') {
            throw new Error('return state error！');
          }

          return nextState;
        }
      }

      return prevState;
    };

    addReducer(namespace, reducer, effects);
  }
};

var rayslog = function rayslog(_ref2) {
  var initialState = _ref2.initialState,
      initialModels = _ref2.initialModels,
      _ref2$middlewares = _ref2.middlewares,
      middlewares = _ref2$middlewares === void 0 ? [] : _ref2$middlewares;

  // 初始model
  if (isPlainObject(initialModels)) {
    for (var key in initialModels) {
      var initialModel = initialModels[key];

      if (isPlainObject(initialModel)) {
        model(initialModel);
      }
    }
  }

  var effectsMiddle = function effectsMiddle(store) {
    return function (_dispatch) {
      return function (action) {
        if (isPlainObject(action) && typeof action.type === 'string') {
          var type = action.type,
              args = _objectWithoutProperties(action, ["type"]);

          var actionType = action.type.split('/');
          var namespace = actionType[0];
          var actualtype = actionType[1];

          if (rootEffects[namespace] && rootEffects[namespace][actualtype]) {
            return rootEffects[namespace][actualtype]({
              dispatch: function dispatch(_ref3) {
                var type = _ref3.type,
                    rest = _objectWithoutProperties(_ref3, ["type"]);

                return _dispatch(_objectSpread({
                  type: "".concat(namespace, "/").concat(type)
                }, rest));
              }
            }, _objectSpread({}, args));
          }

          return _dispatch(action);
        }

        return _dispatch(action);
      };
    };
  };

  var composeEnhancers = compose;

  if (!isNode) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  } // 创建store


  store = createStore(combineReducers(rootReducers), initialState, composeEnhancers(applyMiddleware.apply(void 0, [effectsMiddle].concat(_toConsumableArray(middlewares)))));
  return {
    store: store,
    addReducer: addReducer,
    getStore: function getStore() {
      return store;
    }
  };
};

export default rayslog;
export { addReducer, model };
