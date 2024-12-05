package web.services;

import java.io.Serializable;

import web.models.Attempt;


// определяет контракт для проверки попадания точки в заданную область
public interface AreaCheck extends Serializable {
  void checkHit(Attempt attemptBean);
}
