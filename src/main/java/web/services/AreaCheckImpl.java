package web.services;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;

import java.io.Serializable;
import java.util.Date;

import web.models.Attempt;

@Named("areaCheck")
@SessionScoped
@AreaCheckQualifier //кастомный квалификатор, связывающий эту
// реализацию с соответствующим интерфейсом для внедрения.

// реализует интерфейс AreaCheck, а именно логику
// проверки попадания точки в область
public class AreaCheckImpl implements AreaCheck, Serializable {
  @Override
  public void checkHit(Attempt attemptBean) {
    long startTime = System.nanoTime();
    boolean hit = attemptIsInArea(attemptBean);
    System.out.println("checkHit: x=" + attemptBean.getX() + ", y=" + attemptBean.getY() + ", r=" + attemptBean.getR() + ", hit=" + hit);
    attemptBean.setResult(hit);
    attemptBean.setExecutionTime(System.nanoTime() - startTime);
  }



  private boolean attemptIsInArea(Attempt attemptBean) {
    var x = attemptBean.getX();
    var y = attemptBean.getY();
    var r = attemptBean.getR();
    return attemptIsInRect(x, y, r) || attemptIsInTriangle(x, y, r) || attemptIsInSector(x, y, r);
  }

  private boolean attemptIsInRect(double x, double y, double r) {
    return (x >= 0 && x <= r) && (y >= 0 && y <= r / 2);
  }

  private boolean attemptIsInTriangle(double x, double y, double r) {
    if (x >= -r / 2 && x <= 0 && y >= 0 && y <= r) {
      return y <= (-2 * x) + r;
    }
    return false;
  }

  private boolean attemptIsInSector(double x, double y, double r) {
    double epsilon = 1e-10;
    boolean condition1 = x <= 0 + epsilon && y <= 0 + epsilon;
    double distanceSquared = x * x + y * y;
    double radiusSquared = r * r;
    boolean condition2 = distanceSquared <= radiusSquared + epsilon;
    System.out.println("attemptIsInSector: x=" + x + ", y=" + y + ", condition1=" + condition1 + ", condition2=" + condition2);
    return condition1 && condition2;
  }

}
