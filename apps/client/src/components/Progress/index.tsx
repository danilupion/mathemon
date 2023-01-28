import './index.module.scss';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}
const Progress = ({ value, max, className }: ProgressProps) => {
  return <progress value={value} max={max} className={className} />;
};

export default Progress;
