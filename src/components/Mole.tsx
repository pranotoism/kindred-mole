import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface MoleProps {
  isVisible: boolean;
  onHit: (isGolden: boolean) => void;
}

const Mole: React.FC<MoleProps> = ({ isVisible, onHit }) => {
  const [isGolden, setIsGolden] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const goldenChance = Math.random() < 0.2;
      setIsGolden(goldenChance);
    }
  }, [isVisible]);

  return (
    <div
      onClick={() => onHit(isGolden)}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: isVisible ? (isGolden ? 'gold' : 'brown') : 'green',
        cursor: isVisible ? 'pointer' : 'default',
      }}
    >
      {isVisible &&
        (isGolden ? (
          <Image
            src={'/kindred-mole/assets/mole-king.png'}
            alt='mole king'
            width={100}
            height={100}
          />
        ) : (
          <Image
            src={'/kindred-mole/assets/mole.png'}
            alt='normal mole'
            width={100}
            height={100}
          />
        ))}
    </div>
  );
};

export default Mole;
