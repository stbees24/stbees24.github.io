import React from "react";
import { SbsAppButton } from "./SbsAppButton";

export const SbsAppGrid = () => (
  <>
    <div className="container overflow-hidden text-center py-3">
      <div className="row gx-2 gy-2">
        <div className="col-6">
          <div>
            <SbsAppButton
              label="2024 Sci Fair"
              onClick={() => {
                location.href = "/24-sci-fair";
              }}
            />
          </div>
        </div>
        <div className="col-6">
          <div>
            <SbsAppButton />
          </div>
        </div>
        <div className="col-4">
          <div>
            <SbsAppButton />
          </div>
        </div>
        <div className="col-4">
          <div>
            <SbsAppButton />
          </div>
        </div>
        <div className="col-4">
          <div>
            <SbsAppButton />
          </div>
        </div>
      </div>
    </div>
  </>
);
