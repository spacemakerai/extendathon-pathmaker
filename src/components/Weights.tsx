import state from "../pathmaker/state.ts";

function InputSlider({
  value,
  min,
  max,
  label,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  step: number;
  onChange: (value: number) => void;
}) {
  // @ts-ignore
  return (
    <>
      <p style={{ marginBottom: 0 }}>{label}</p>
      <div className="row">
        <weave-slider
          value={value}
          min={min}
          max={max}
          step={step}
          variant="discrete"
          label={label}
          //@ts-ignore
          onInput={(e) => onChange(e.detail)}
        ></weave-slider>
        <weave-input
          style={{ width: "40px", marginLeft: "12px" }}
          type="number"
          value={value}
          label={label}
          step={step}
          //@ts-ignore
          onChange={(e) => onChange(e.detail)}
        ></weave-input>
      </div>
    </>
  );
}

export default function Weights() {
  const { point, road, pheromone, keepSpeed } = state.agentWeights.value;
  return (
    <>
      <InputSlider
        value={point}
        max={1}
        min={0}
        label={"Point"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, point: value };
        }}
      />
      <InputSlider
        value={road}
        max={5}
        min={0}
        label={"Road"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, road: value };
        }}
      />
      <InputSlider
        value={pheromone}
        max={3}
        min={0}
        label={"Pheromone"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, pheromone: value };
        }}
      />
      <InputSlider
        value={keepSpeed}
        max={4}
        min={0}
        label={"Velocity"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, keepSpeed: value };
        }}
      />
    </>
  );
}
