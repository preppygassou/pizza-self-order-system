import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import SubMenu from './SubMenu';
import { getWidth, setStyle, menuAllProps } from './util';
var MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';
var FLOAT_PRECISION_ADJUST = 0.5;

var DOMWrap =
/** @class */
function () {
  var DOMWrap = /*#__PURE__*/function (_React$Component) {
    _inherits(DOMWrap, _React$Component);

    var _super = _createSuper(DOMWrap);

    function DOMWrap() {
      var _this;

      _classCallCheck(this, DOMWrap);

      _this = _super.apply(this, arguments);
      _this.resizeObserver = null;
      _this.mutationObserver = null; // original scroll size of the list

      _this.originalTotalWidth = 0; // copy of overflowed items

      _this.overflowedItems = []; // cache item of the original items (so we can track the size and order)

      _this.menuItemSizes = [];
      _this.cancelFrameId = null;
      _this.state = {
        lastVisibleIndex: undefined
      }; // get all valid menuItem nodes

      _this.getMenuItemNodes = function () {
        var prefixCls = _this.props.prefixCls;
        var ul = ReactDOM.findDOMNode(_assertThisInitialized(_this));

        if (!ul) {
          return [];
        } // filter out all overflowed indicator placeholder


        return [].slice.call(ul.children).filter(function (node) {
          return node.className.split(' ').indexOf("".concat(prefixCls, "-overflowed-submenu")) < 0;
        });
      };

      _this.getOverflowedSubMenuItem = function (keyPrefix, overflowedItems, renderPlaceholder) {
        var _this$props = _this.props,
            overflowedIndicator = _this$props.overflowedIndicator,
            level = _this$props.level,
            mode = _this$props.mode,
            prefixCls = _this$props.prefixCls,
            theme = _this$props.theme;

        if (level !== 1 || mode !== 'horizontal') {
          return null;
        } // put all the overflowed item inside a submenu
        // with a title of overflow indicator ('...')


        var copy = _this.props.children[0];

        var _copy$props = copy.props,
            throwAway = _copy$props.children,
            title = _copy$props.title,
            propStyle = _copy$props.style,
            rest = _objectWithoutProperties(_copy$props, ["children", "title", "style"]);

        var style = _objectSpread({}, propStyle);

        var key = "".concat(keyPrefix, "-overflowed-indicator");
        var eventKey = "".concat(keyPrefix, "-overflowed-indicator");

        if (overflowedItems.length === 0 && renderPlaceholder !== true) {
          style = _objectSpread(_objectSpread({}, style), {}, {
            display: 'none'
          });
        } else if (renderPlaceholder) {
          style = _objectSpread(_objectSpread({}, style), {}, {
            visibility: 'hidden',
            // prevent from taking normal dom space
            position: 'absolute'
          });
          key = "".concat(key, "-placeholder");
          eventKey = "".concat(eventKey, "-placeholder");
        }

        var popupClassName = theme ? "".concat(prefixCls, "-").concat(theme) : '';
        var props = {};
        menuAllProps.forEach(function (k) {
          if (rest[k] !== undefined) {
            props[k] = rest[k];
          }
        });
        return React.createElement(SubMenu, Object.assign({
          title: overflowedIndicator,
          className: "".concat(prefixCls, "-overflowed-submenu"),
          popupClassName: popupClassName
        }, props, {
          key: key,
          eventKey: eventKey,
          disabled: false,
          style: style
        }), overflowedItems);
      }; // memorize rendered menuSize


      _this.setChildrenWidthAndResize = function () {
        if (_this.props.mode !== 'horizontal') {
          return;
        }

        var ul = ReactDOM.findDOMNode(_assertThisInitialized(_this));

        if (!ul) {
          return;
        }

        var ulChildrenNodes = ul.children;

        if (!ulChildrenNodes || ulChildrenNodes.length === 0) {
          return;
        }

        var lastOverflowedIndicatorPlaceholder = ul.children[ulChildrenNodes.length - 1]; // need last overflowed indicator for calculating length;

        setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'inline-block');

        var menuItemNodes = _this.getMenuItemNodes(); // reset display attribute for all hidden elements caused by overflow to calculate updated width
        // and then reset to original state after width calculation


        var overflowedItems = menuItemNodes.filter(function (c) {
          return c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >= 0;
        });
        overflowedItems.forEach(function (c) {
          setStyle(c, 'display', 'inline-block');
        });
        _this.menuItemSizes = menuItemNodes.map(function (c) {
          return getWidth(c);
        });
        overflowedItems.forEach(function (c) {
          setStyle(c, 'display', 'none');
        });
        _this.overflowedIndicatorWidth = getWidth(ul.children[ul.children.length - 1]);
        _this.originalTotalWidth = _this.menuItemSizes.reduce(function (acc, cur) {
          return acc + cur;
        }, 0);

        _this.handleResize(); // prevent the overflowed indicator from taking space;


        setStyle(lastOverflowedIndicatorPlaceholder, 'display', 'none');
      };

      _this.handleResize = function () {
        if (_this.props.mode !== 'horizontal') {
          return;
        }

        var ul = ReactDOM.findDOMNode(_assertThisInitialized(_this));

        if (!ul) {
          return;
        }

        var width = getWidth(ul);
        _this.overflowedItems = [];
        var currentSumWidth = 0; // index for last visible child in horizontal mode

        var lastVisibleIndex; // float number comparison could be problematic
        // e.g. 0.1 + 0.2 > 0.3 =====> true
        // thus using FLOAT_PRECISION_ADJUST as buffer to help the situation

        if (_this.originalTotalWidth > width + FLOAT_PRECISION_ADJUST) {
          lastVisibleIndex = -1;

          _this.menuItemSizes.forEach(function (liWidth) {
            currentSumWidth += liWidth;

            if (currentSumWidth + _this.overflowedIndicatorWidth <= width) {
              lastVisibleIndex += 1;
            }
          });
        }

        _this.setState({
          lastVisibleIndex: lastVisibleIndex
        });
      };

      return _this;
    }

    _createClass(DOMWrap, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        this.setChildrenWidthAndResize();

        if (this.props.level === 1 && this.props.mode === 'horizontal') {
          var menuUl = ReactDOM.findDOMNode(this);

          if (!menuUl) {
            return;
          }

          this.resizeObserver = new ResizeObserver(function (entries) {
            entries.forEach(function () {
              var cancelFrameId = _this2.cancelFrameId;
              cancelAnimationFrame(cancelFrameId);
              _this2.cancelFrameId = requestAnimationFrame(_this2.setChildrenWidthAndResize);
            });
          });
          [].slice.call(menuUl.children).concat(menuUl).forEach(function (el) {
            _this2.resizeObserver.observe(el);
          });

          if (typeof MutationObserver !== 'undefined') {
            this.mutationObserver = new MutationObserver(function () {
              _this2.resizeObserver.disconnect();

              [].slice.call(menuUl.children).concat(menuUl).forEach(function (el) {
                _this2.resizeObserver.observe(el);
              });

              _this2.setChildrenWidthAndResize();
            });
            this.mutationObserver.observe(menuUl, {
              attributes: false,
              childList: true,
              subTree: false
            });
          }
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }

        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
        }

        cancelAnimationFrame(this.cancelFrameId);
      }
    }, {
      key: "renderChildren",
      value: function renderChildren(children) {
        var _this3 = this;

        // need to take care of overflowed items in horizontal mode
        var lastVisibleIndex = this.state.lastVisibleIndex;
        return (children || []).reduce(function (acc, childNode, index) {
          var item = childNode;

          if (_this3.props.mode === 'horizontal') {
            var overflowed = _this3.getOverflowedSubMenuItem(childNode.props.eventKey, []);

            if (lastVisibleIndex !== undefined && _this3.props.className.indexOf("".concat(_this3.props.prefixCls, "-root")) !== -1) {
              if (index > lastVisibleIndex) {
                item = React.cloneElement(childNode, // 这里修改 eventKey 是为了防止隐藏状态下还会触发 openkeys 事件
                {
                  style: {
                    display: 'none'
                  },
                  eventKey: "".concat(childNode.props.eventKey, "-hidden"),

                  /**
                   * Legacy code. Here `className` never used:
                   * https://github.com/react-component/menu/commit/4cd6b49fce9d116726f4ea00dda85325d6f26500#diff-e2fa48f75c2dd2318295cde428556a76R240
                   */
                  className: "".concat(MENUITEM_OVERFLOWED_CLASSNAME)
                });
              }

              if (index === lastVisibleIndex + 1) {
                _this3.overflowedItems = children.slice(lastVisibleIndex + 1).map(function (c) {
                  return React.cloneElement(c, // children[index].key will become '.$key' in clone by default,
                  // we have to overwrite with the correct key explicitly
                  {
                    key: c.props.eventKey,
                    mode: 'vertical-left'
                  });
                });
                overflowed = _this3.getOverflowedSubMenuItem(childNode.props.eventKey, _this3.overflowedItems);
              }
            }

            var ret = [].concat(_toConsumableArray(acc), [overflowed, item]);

            if (index === children.length - 1) {
              // need a placeholder for calculating overflowed indicator width
              ret.push(_this3.getOverflowedSubMenuItem(childNode.props.eventKey, [], true));
            }

            return ret;
          }

          return [].concat(_toConsumableArray(acc), [item]);
        }, []);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            visible = _this$props2.visible,
            prefixCls = _this$props2.prefixCls,
            overflowedIndicator = _this$props2.overflowedIndicator,
            mode = _this$props2.mode,
            level = _this$props2.level,
            tag = _this$props2.tag,
            children = _this$props2.children,
            theme = _this$props2.theme,
            rest = _objectWithoutProperties(_this$props2, ["visible", "prefixCls", "overflowedIndicator", "mode", "level", "tag", "children", "theme"]);

        var Tag = tag;
        return React.createElement(Tag, Object.assign({}, rest), this.renderChildren(children));
      }
    }]);

    return DOMWrap;
  }(React.Component);

  DOMWrap.defaultProps = {
    tag: 'div',
    className: ''
  };
  return DOMWrap;
}();

export default DOMWrap;