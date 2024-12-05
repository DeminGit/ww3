package web.repositories;

import com.google.gson.Gson;
import jakarta.enterprise.context.RequestScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.PersistenceUnit;
import jakarta.persistence.TypedQuery;
import web.models.Attempt;
import web.services.AreaCheck;
import web.services.AreaCheckQualifier;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Named("attemptRepository")
@RequestScoped
public class AttemptRepository {

  @Inject
  @AreaCheckQualifier
  private AreaCheck areaCheck;

  @PersistenceUnit(unitName = "my-persistence-unit")
  private EntityManagerFactory entityManagerFactory;

  private static final int LATEST_ATTEMPTS_COUNT = 10;

  public List<Attempt> getAttemptsList(int start, int count) {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    try {
      TypedQuery<Attempt> query = entityManager.createQuery("SELECT a FROM Attempt a ORDER BY a.id", Attempt.class);
      query.setFirstResult(start);
      query.setMaxResults(count);
      return query.getResultList();
    } finally {
      entityManager.close();
    }
  }

  public int getAttemptsCount() {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    try {
      Long count = entityManager.createQuery("SELECT COUNT(a) FROM Attempt a", Long.class).getSingleResult();
      return count.intValue();
    } finally {
      entityManager.close();
    }
  }

  public void addAttempt(Attempt attempt) {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    EntityTransaction transaction = entityManager.getTransaction();
    try {
      transaction.begin();

      System.out.println("Before checkHit, attempt: " + attempt);
      areaCheck.checkHit(attempt);
      System.out.println("After checkHit, attempt: " + attempt);

      attempt.setCreatedAt(new Date());
      attempt.setExecutionTime(System.currentTimeMillis());

      entityManager.persist(attempt);

      transaction.commit();
    } catch (Exception e) {
      if (transaction.isActive()) {
        transaction.rollback();
      }
      e.printStackTrace();
    } finally {
      entityManager.close();
    }
  }



  public void clearAttempts() {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    EntityTransaction transaction = entityManager.getTransaction();
    try {
      transaction.begin();

      entityManager.createQuery("DELETE FROM Attempt").executeUpdate();

      transaction.commit();
    } catch (Exception e) {
      if (transaction.isActive()) {
        transaction.rollback();
      }
      e.printStackTrace();
    } finally {
      entityManager.close();
    }
  }

  public void addAttemptFromJsParams() {
    Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
    try {
      double x = Double.parseDouble(params.get("x"));
      double y = Double.parseDouble(params.get("y"));
      double r = Double.parseDouble(params.get("r"));

      Attempt attempt = new Attempt(x, y, r);
      addAttempt(attempt);

    } catch (NumberFormatException e) {
      e.printStackTrace();
    }
  }

  public List<Attempt> getAllAttemptsList() {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    try {
      TypedQuery<Attempt> query = entityManager.createQuery("SELECT a FROM Attempt a ORDER BY a.id ASC", Attempt.class);
      return query.getResultList();
    } finally {
      entityManager.close();
    }
  }


  public String getPointsCoordinates() {
    List<Attempt.Coordinates> coordinatesList = getAllAttemptsList().stream()
      .map(Attempt::getCoordinates)
      .collect(Collectors.toList());
    return new Gson().toJson(coordinatesList);
  }



}
