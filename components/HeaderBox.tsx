const HeaderBox = ({
  type = 'title', // Default type is 'title', can be 'greeting'
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      {' '}
      {/* Container for the header box */}
      <h1 className="header-box-title">
        {title} {/* Title text */}
        {type === 'greeting' && (
          <span className="text-bankGradient">&nbsp;{user}</span> // Display user's name if type is 'greeting'
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>{' '}
      {/* Subtitle or additional text */}
    </div>
  );
};

export default HeaderBox;
