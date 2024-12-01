export interface SbsAppButtonProps {
  label?: string;
  onClick?: () => void;
}

export const SbsAppButton = ({ label, ...props }: SbsAppButtonProps) => (
  <>
    <button className="btn btn-primary rounded-5 p-3" {...props}>
      {label ?? "??????"}
    </button>
    {/*
    <a href={href ?? "#"}>
      <div class="d-flex center justify-content-center align-items-center border border-2 rounded-5 p-3">
        <span>{label ?? "??????"}</span>
      </div>
    </a>
    */}
  </>
);
