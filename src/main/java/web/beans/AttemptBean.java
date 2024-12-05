package web.beans;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import web.models.Attempt;
import web.repositories.AttemptRepository;

import java.io.Serializable;

@Named("attemptBean")
@SessionScoped
public class AttemptBean implements Serializable {

  private Double x;
  private Double y;
  private Double r;

  @Inject
  private AttemptRepository attemptRepository;



  public Double getX() {
    return x;
  }

  public void setX(Double x) {
    this.x = x;
  }

  public Double getY() {
    return y;
  }

  public void setY(Double y) {
    this.y = y;
  }

  public Double getR() {
    return r;
  }

  public void setR(Double r) {
    this.r = r;
  }

  // Метод для добавления попытки
  public void addAttempt() {
    Attempt attempt = new Attempt(x, y, r);
    attemptRepository.addAttempt(attempt);
  }


}
