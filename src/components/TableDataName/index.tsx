import './styles.css';

interface ITableDataName {
  src: string;
  text: string;
  subText: string;
}

export const TableDataName = ({ src, text, subText }: ITableDataName) => (
  <>
    <img src={src} alt={text} width="24px" height="24px" />
    &nbsp;
    <span>{text}</span>
    &nbsp;
    <em>{subText}</em>
  </>
);
