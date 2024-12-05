package web.repositories;

import org.primefaces.model.FilterMeta;
import org.primefaces.model.LazyDataModel;
import org.primefaces.model.SortMeta;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import web.models.Attempt;

import java.util.List;
import java.util.Map;

@Named("attemptsList")
@SessionScoped

// взаимодействует с AttemptRepository для получения списка
// попыток и их общего количества.
public class AttemptDataModel extends LazyDataModel<Attempt> {

  @Inject
  // внедряет зависимость AttemptRepository в бин
  private AttemptRepository service;

  @Override
  public int count(Map<String, FilterMeta> map) {
    return service.getAttemptsCount();
  }

  @Override
  public List<Attempt> load(int first, int pageSize, Map<String, SortMeta> sortBy, Map<String, FilterMeta> filterBy) {
    return service.getAttemptsList(first, pageSize);
  }
}
