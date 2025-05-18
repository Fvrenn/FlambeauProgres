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
            <div className="flex items-center justify-space-between gap-10">
              <h3 className="chemise-txt1 font-koulen text-header text-white">
                Ma chemise
              </h3>
              {/* <h3 className="etape2 font-LuckiestGuy text-[30px] text-white"> 4 etape validée</h3> */}
            </div>
          </div>

          <div className=" container__3d">
            <div className="content__3d">
              <h3 className="chemise-txt2 font-koulen text-header text-white">
                Ma chemise
              </h3>
              <div className="content__3d__container">
                <ThreeScene />
              </div>

              <div className="content__badges">
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2b-spe_PF.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2c-spe_F.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2e-spe_animation.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2f-spe_communication.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2g-spe_construction.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2h-spe_cuisine.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2i-spe_explo.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2j-spe_intendance.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2k-spe_materiel.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2l-spe_nature.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2m-sante.svg" alt="" />
                  </div>
                </div>
                <div className="holographic-container">
                  <div className="holographic-card">
                    <img src="/etape-badges/2n-spe_vie_spi.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 ml-auto content__text">
              <div className="ml-10 ">
                <div className="ml-20 triangle-shape-1 mt-[-80px] flex justify-center mr-40 w-40">
                  <img src="/shape-triangle/triangle2.svg" alt="" />
                </div>
                <h1 className=" pr-10 font-LuckiestGuy text-[70px] text-white leading-[90px]">
                  4 etape validée
                </h1>
                <div className="triangle-shape-2 flex justify-end mr-[-20px] w-40">
                  <img src="/shape-triangle/triangle1.svg" alt="" />
                </div>
              </div>
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
