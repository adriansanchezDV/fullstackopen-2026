import { filterChanged } from "../actions/filterActions";
import { useDispatch } from "react-redux";

const VisibilityFilter = ({ props }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChanged("ALL"))}
      />
      all
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChanged("IMPORTANT"))}
      />
      important
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChanged("NONIMPORTANT"))}
      />
      nonimportant
    </div>
  );
};
export default VisibilityFilter;
