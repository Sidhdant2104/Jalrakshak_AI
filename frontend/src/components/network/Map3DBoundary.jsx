import { Component } from "react";

export default class Map3DBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("3D network map failed", error);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="map-canvas map-3d">
            <p className="muted" style={{ padding: 16 }}>
              3D map could not load. Switch to 2D view.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
