import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import * as React from 'react';
import warning from "rc-util/es/warning";
import FieldContext from './FieldContext';
import Field from './Field';
import { move as _move, getNamePath } from './utils/valueUtil';

var List = function List(_ref) {
  var name = _ref.name,
      children = _ref.children;
  var context = React.useContext(FieldContext);
  var keyRef = React.useRef({
    keys: [],
    id: 0
  });
  var keyManager = keyRef.current; // User should not pass `children` as other type.

  if (typeof children !== 'function') {
    warning(false, 'Form.List only accepts function as children.');
    return null;
  }

  var parentPrefixName = getNamePath(context.prefixName) || [];
  var prefixName = [].concat(_toConsumableArray(parentPrefixName), _toConsumableArray(getNamePath(name)));

  var shouldUpdate = function shouldUpdate(prevValue, nextValue, _ref2) {
    var source = _ref2.source;

    if (source === 'internal') {
      return false;
    }

    return prevValue !== nextValue;
  };

  return React.createElement(FieldContext.Provider, {
    value: _objectSpread({}, context, {
      prefixName: prefixName
    })
  }, React.createElement(Field, {
    name: [],
    shouldUpdate: shouldUpdate
  }, function (_ref3) {
    var _ref3$value = _ref3.value,
        value = _ref3$value === void 0 ? [] : _ref3$value,
        onChange = _ref3.onChange;
    var getFieldValue = context.getFieldValue;

    var getNewValue = function getNewValue() {
      var values = getFieldValue(prefixName || []);
      return values || [];
    };
    /**
     * Always get latest value in case user update fields by `form` api.
     */


    var operations = {
      add: function add(defaultValue) {
        // Mapping keys
        keyManager.keys = [].concat(_toConsumableArray(keyManager.keys), [keyManager.id]);
        keyManager.id += 1;
        var newValue = getNewValue();
        onChange([].concat(_toConsumableArray(newValue), [defaultValue]));
      },
      remove: function remove(index) {
        var newValue = getNewValue(); // Do not handle out of range

        if (index < 0 || index >= newValue.length) {
          return;
        } // Update key mapping


        var newKeys = keyManager.keys.map(function (key, id) {
          if (id < index) {
            return key;
          }

          return keyManager.keys[id + 1];
        });
        keyManager.keys = newKeys.slice(0, -1); // Trigger store change

        onChange(newValue.filter(function (_, id) {
          return id !== index;
        }));
      },
      move: function move(from, to) {
        if (from === to) {
          return;
        }

        var newValue = getNewValue(); // Do not handle out of range

        if (from < 0 || from >= newValue.length || to < 0 || to >= newValue.length) {
          return;
        }

        keyManager.keys = _move(keyManager.keys, from, to); // Trigger store change

        onChange(_move(newValue, from, to));
      }
    };
    return children(value.map(function (__, index) {
      var key = keyManager.keys[index];

      if (key === undefined) {
        keyManager.keys[index] = keyManager.id;
        key = keyManager.keys[index];
        keyManager.id += 1;
      }

      return {
        name: index,
        key: key,
        isListField: true
      };
    }), operations);
  }));
};

export default List;