package web.models;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "ATTEMPTS")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Attempt implements Serializable {

  @Getter
  @ToString
  @AllArgsConstructor
  public static class Coordinates {
    private final double x;
    private final double y;
    private final double r;
    private final boolean result;
  }

  public Attempt(double x, double y, double r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "attempt_seq")
  @SequenceGenerator(name = "attempt_seq", sequenceName = "ATTEMPT_SEQ", allocationSize = 1)
  private Integer id;

  @NotNull(message = "X не может быть пустым")
  @DecimalMin(value = "-5.1", inclusive = true, message = "X должно быть не меньше -5.0")
  @DecimalMax(value = "5.1", inclusive = true, message = "X должно быть не больше 5.0")
  private Double x;

  @NotNull(message = "Y не может быть пустым")
  @DecimalMin(value = "-5.1", inclusive = true, message = "Y должно быть не меньше -5.0")
  @DecimalMax(value = "5.1", inclusive = true, message = "Y должно быть не больше 5.0")
  private Double y;

  @NotNull(message = "R не может быть пустым")
  @DecimalMin(value = "1.0", inclusive = true, message = "R должно быть не меньше 1.0")
  @DecimalMax(value = "3.0", inclusive = true, message = "R должно быть не больше 3.0")
  private Double r = 1.0;

  private Boolean result;

  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt;

  private Long executionTime;


  public Coordinates getCoordinates() {
    return new Coordinates(x, y, r, result);
  }
}
