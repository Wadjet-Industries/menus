import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';
import HideButton from './HideButton';
import styles from './css_modules/app.css';

const ipAddress = '52.53.171.255';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: sample[0],
      selectedMealOption: 'Brunch',
      fullMenuIsVisible: false,
    };
    this.getMenuData = this.getMenuData.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.getMealOptionList = this.getMealOptionList.bind(this);
  }

  // gets menu data as soon as page renders
  componentDidMount() {
    this.getMenuData();
  }

  getMealOptionList() {
    const { menu } = this.state;
    return Object.keys(menu);
  }

  // get menu data from server
  getMenuData() {
    const id = window.location.pathname.split('/')[2];
    $.get(`http://${ipAddress}/api/restaurant/${id === undefined ? '1' : id}/menu`, (result) => {
      this.setState({
        menu: result[0],
        selectedMealOption: Object.keys(result[0])[0],
      });
    });
  }

  // handles button click changing states
  handleViewChange(mealOption) {
    this.setState({ selectedMealOption: mealOption });
  }

  // handles rendering the bottom half of the menu
  handleVisibility() {
    const { fullMenuIsVisible } = this.state;
    if (fullMenuIsVisible === true) {
      this.setState({ fullMenuIsVisible: false });
    } else {
      this.setState({ fullMenuIsVisible: true });
    }
  }


  render() {
    const { menu, fullMenuIsVisible, selectedMealOption } = this.state;
    const mealOptions = this.getMealOptionList();
    const categories = menu[selectedMealOption];
    // if (!categories) debugger;
    return (
      <div className={styles.masterContainer}>
        <h1>Menu</h1>
        <div className={styles.jrContainer}>
          <hr />
          <div className={styles.mealOptions}>
            {
              mealOptions.map((mealOption) => (
                <MealOption
                  selected={selectedMealOption === mealOption}
                  changeMeal={this.handleViewChange}
                  mealOption={mealOption}
                />
              ))
            }
          </div>
          <hr />
        </div>
        <div className={fullMenuIsVisible ? styles.meals2 : styles.meals}>
          {Object.keys(categories).map((categoryName) => {
            const dishes = categories[categoryName];
            return (
              <div>
                <Category categoryName={categoryName} dishes={dishes} />
                <hr />
              </div>
            );
          })}
        </div>
        <div className={styles.hideButton}>
          <HideButton
            handleVisibility={this.handleVisibility}
            fullMenuIsVisible={fullMenuIsVisible}
          />
        </div>
      </div>
    );
  }
}

window.menu = Menu;
export default Menu;
