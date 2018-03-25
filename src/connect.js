import { mapDispatch, mapState } from "./helper";
import { getStore } from "./store";

const defaultMapToProps = () => ({});

export default (
  mapStateToProps = defaultMapToProps,
  mapDispatchToProps = defaultMapToProps()
) => {
  const store = getStore();
  return function connectComponent(Component) {
    let unSubscribe = null;
    const onLoad = Component.prototype.onLoad;
    const onUnload = Component.prototype.onUnload;

    return class extends Component {
      constructor() {
        super();
        const props = Object.keys(this.props || {}).reduce(
          (props, propKey) => ({
            ...props,
            [propKey]: this[propKey]
          }),
          {}
        );
        const state = mapStateToProps(store.getState(), props);
        this.computed = {
          ...(this.computed || {}),
          ...mapState(state)
        };
        this.methods = {
          ...(this.methods || {}),
          ...mapDispatch(mapDispatchToProps)
        };
      }
      onStateChange = (options = {}) => {
        const props = Object.keys(this.props || {}).reduce(
          (props, propKey) => ({
            ...props,
            [propKey]: this[propKey]
          }),
          {}
        );
        const state = mapStateToProps(store.getState(), {
          ...props,
          ...this.navigationParams
        });
        let hasChanged = false;
        Object.keys(state).forEach(k => {
          const newV = state[k];
          if (this[k] !== newV) {
            this.computed[k] = () => newV;
            hasChanged = true;
          }
        });
        hasChanged && this.$apply();
      };
      onLoad(options) {
        unSubscribe = store.subscribe(this.onStateChange);
        this.navigationParams = options || {};
        this.onStateChange();
        onLoad && onLoad.apply(this, arguments);
      }
      onUnload() {
        unSubscribe && unSubscribe();
        unSubscribe = null;
        onUnload && onUnload.apply(this, arguments);
      }
    };
  };
};
