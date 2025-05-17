import ThreeScene from "../public/3D/ThreeScene";

export default function Home() {
  return (
    <div className="page__container">
      <div className="panel--primary">
        <div className="panel--primary__content">
          <div className="panel-border__top-left"></div>
          <div className="panel-border__top-middle"></div>
          <div className="panel-border__top-right"></div>
          <div className="triangle__container">
            <div className="triangle__rounded"></div>
            <div className="triangle__cache"></div>
          </div>
          <div className="content__title">
            <h3 className="font-koulen text-header text-white">Ma chemise</h3>
          </div>
          <div className="content__3d">
            <div className="content__3d__container">
              <ThreeScene />
            </div>

            <div className="content__badges">
              <img src="/etape-badges/Group.png" alt="" />
              <img src="/etape-badges/Rectangle-1.png" alt="" />
              <img src="/etape-badges/Rectangle-10.png" alt="" />
              <img src="/etape-badges/Rectangle-2.png" alt="" />
              <img src="/etape-badges/Rectangle-3.png" alt="" />
              <img src="/etape-badges/Rectangle-4.png" alt="" />
              <img src="/etape-badges/Rectangle-5.png" alt="" />
              <img src="/etape-badges/Rectangle-6.png" alt="" />
              <img src="/etape-badges/Rectangle-7.png" alt="" />
              <img src="/etape-badges/Rectangle-8.png" alt="" />
              <img src="/etape-badges/Rectangle-9.png" alt="" />
              <img src="/etape-badges/Rectangle.png" alt="" />
            </div>
          </div>

          <div className="left-side">
            <div className="triaangle-shape-1"></div>
            <div className="title"></div>
            <div className="triaangle-shape-2"></div>
          </div>
        </div>
      </div>

      <div className="panel--secondary">
        <div className="panel--secondary__content flex items-center justify-center">
          <h2 className="font-koulen text-2xl text-white font-bold tracking-wide">
            MA PROGRESSION
          </h2>
        </div>
      </div>
      <div className="panel--tertiary">
        <div className="panel--tertiary__content flex items-center justify-center">
          <h2 className="font-koulen text-2xl text-white font-bold tracking-wide">
            MA PROGRESSION
          </h2>
        </div>
      </div>
      <div className="panel--quaternary">
        <div className="panel--quaternary__content flex items-center justify-center">
          <h2 className="font-koulen text-2xl text-white font-bold tracking-wide">
            MA PROGRESSION
          </h2>
        </div>
      </div>

      <div className="triangle__accent-container">
        <svg
          width="373"
          height="373"
          viewBox="0 0 373 373"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <g transform="translate(0, 20)">
            <path
              d="M21.2123 251.788L251.788 21.2125C296.518 -23.5179 373 8.16199 373 71.4204V301.995C373 341.21 341.21 373 301.995 373H71.4203C8.16197 373 -23.5181 296.518 21.2123 251.788Z"
              fill="#FEB38F"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
