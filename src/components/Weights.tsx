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
          onInput={(e) => onChange(parseFloat(e.detail))}
        ></weave-slider>
        <weave-input
          style={{ maxWidth: "50px", marginLeft: "12px" }}
          type="number"
          value={value}
          label={label}
          step={step}
          //@ts-ignore
          onChange={(e) => onChange(parseFloat(e.detail))}
        ></weave-input>
      </div>
    </>
  );
}

export default function Weights() {
  const { point, road, pheromone, keepSpeed, pheromoneDecay, building, random } =
    state.agentWeights.value;

  return (
    <>
      <InputSlider
        value={state.numberOfAgents.value}
        max={10000}
        min={10}
        label={"Number of agents"}
        step={100}
        onChange={(value) => {
          state.numberOfAgents.value = value;
        }}
      />
      <InputSlider
        value={point}
        max={1}
        min={0}
        label={"Point attraction"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, point: value };
        }}
      />
      <InputSlider
        value={road}
        max={5}
        min={0}
        label={"Road attraction"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, road: value };
        }}
      />
      <InputSlider
        value={pheromone}
        max={3}
        min={0}
        label={"Pheromone attraction"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, pheromone: value };
        }}
      />
      <InputSlider
        value={keepSpeed}
        max={4}
        min={0}
        label={"Keep direction factor"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, keepSpeed: value };
        }}
      />
      <InputSlider
        value={building}
        max={10}
        min={0}
        label={"Building avoidance"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, building: value };
        }}
      />
      <InputSlider
        value={random}
        max={1}
        min={0}
        label={"Random turning"}
        step={0.1}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, random: value };
        }}
      />
      <InputSlider
        value={pheromoneDecay}
        max={1}
        min={0.9}
        label={"Pheromone decay"}
        step={0.01}
        onChange={(value) => {
          state.agentWeights.value = { ...state.agentWeights.value, pheromoneDecay: value };
        }}
      />
    </>
  );
}
